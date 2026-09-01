'use client';

import { cmsPageMeta } from '@/components/cms/cms-page-meta';
import { createCmsErrorPage } from '@/components/cms/create-cms-error-page';

export const EventListError = createCmsErrorPage(cmsPageMeta.eventList);
export const EventDetailError = createCmsErrorPage(cmsPageMeta.eventDetail);
export const EventRecommendedError = createCmsErrorPage(cmsPageMeta.eventRecommended);
export const EventTimetableError = createCmsErrorPage(cmsPageMeta.eventTimetable);
export const NewsListError = createCmsErrorPage(cmsPageMeta.newsList);
export const SponsorError = createCmsErrorPage(cmsPageMeta.sponsor);
export const PartError = createCmsErrorPage(cmsPageMeta.part);
