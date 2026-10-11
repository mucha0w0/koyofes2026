import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

import { isVercelDeployHookUrl, planMicroCMSRevalidation, verifyMicroCMSSignature } from '@/lib/microcms/webhook';

export const dynamic = 'force-dynamic';

type DeployHookResult = 'triggered' | 'not_configured' | 'invalid_url' | 'failed';

async function triggerDeployHook(): Promise<DeployHookResult> {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL?.trim();
  if (!hook) {
    return 'not_configured';
  }
  if (!isVercelDeployHookUrl(hook)) {
    console.error('VERCEL_DEPLOY_HOOK_URL の形式が不正です');
    return 'invalid_url';
  }

  try {
    const response = await fetch(hook, { method: 'POST', signal: AbortSignal.timeout(10_000) });
    if (!response.ok) {
      console.error('Vercel Deploy Hook が失敗しました', response.status);
      return 'failed';
    }
    return 'triggered';
  } catch (error) {
    console.error('Vercel Deploy Hook の呼び出しに失敗しました', error);
    return 'failed';
  }
}

export function GET() {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
}

export async function POST(request: Request) {
  const secret = process.env.MICROCMS_WEBHOOK_SECRET;
  if (!secret) {
    console.error('MICROCMS_WEBHOOK_SECRET が未設定です');
    return NextResponse.json({ message: 'Webhook secret is not configured' }, { status: 500 });
  }

  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
  if (!serviceDomain) {
    console.error('MICROCMS_SERVICE_DOMAIN が未設定です');
    return NextResponse.json({ message: 'microCMS service domain is not configured' }, { status: 500 });
  }

  const bodyText = await request.text();
  const signature = request.headers.get('x-microcms-signature');
  if (!verifyMicroCMSSignature(bodyText, signature, secret)) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(bodyText) as unknown;
  } catch {
    return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
  }

  const decision = planMicroCMSRevalidation(payload, serviceDomain);
  if (decision.kind === 'unauthorized-service') {
    return NextResponse.json({ message: 'Unexpected service' }, { status: 403 });
  }
  if (decision.kind === 'ignored') {
    const status = decision.reason === 'invalid-body' ? 400 : 200;
    return NextResponse.json({ revalidated: false, reason: decision.reason }, { status });
  }

  let deployHook: DeployHookResult | 'not_needed' = 'not_needed';
  if (decision.deploy) {
    deployHook = await triggerDeployHook();
    if (deployHook === 'triggered') {
      // 再ビルドが終わるまで、現在のデプロイに無い詳細 URL へはリンクさせない。
      console.info('microCMS webhook: deploy hook triggered', { api: decision.api, type: decision.type });
      return NextResponse.json({ revalidated: false, deployHook: 'triggered' });
    }
    console.error('microCMS webhook: deploy hook did not run', { api: decision.api, deployHook });
  }

  for (const tag of decision.tags) {
    revalidateTag(tag, { expire: 0 });
  }
  for (const path of decision.paths) {
    revalidatePath(path);
  }

  console.info('microCMS webhook: revalidated', {
    api: decision.api,
    type: decision.type,
    tags: decision.tags,
    paths: decision.paths,
    deployHook,
  });

  return NextResponse.json({
    revalidated: true,
    tags: decision.tags,
    paths: decision.paths,
    deployHook,
  });
}
