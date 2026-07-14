import { buttonDoc, glassSurfaceDoc } from './general.demos';
import {
  checkboxDoc,
  inputDoc,
  selectDoc,
  sliderDoc,
  switchDoc,
  textareaDoc,
} from './entry.demos';
import { modalDoc, popoverDoc, toastDoc, tooltipDoc } from './feedback.demos';
import {
  breadcrumbDoc,
  drawerDoc,
  menuDoc,
  paginationDoc,
  radioGroupDoc,
  segmentedDoc,
  sideNavDoc,
  tabsDoc,
} from './navigation.demos';
import {
  avatarDoc,
  badgeDoc,
  cardDoc,
  progressDoc,
  skeletonDoc,
  spinDoc,
  tagDoc,
} from './display.demos';
import type { ComponentDoc } from './types';

export const COMPONENT_DOCS: ComponentDoc[] = [
  glassSurfaceDoc,
  buttonDoc,
  cardDoc,
  checkboxDoc,
  inputDoc,
  textareaDoc,
  selectDoc,
  radioGroupDoc,
  segmentedDoc,
  sliderDoc,
  switchDoc,
  tabsDoc,
  breadcrumbDoc,
  paginationDoc,
  sideNavDoc,
  drawerDoc,
  menuDoc,
  tooltipDoc,
  popoverDoc,
  modalDoc,
  toastDoc,
  tagDoc,
  badgeDoc,
  avatarDoc,
  progressDoc,
  spinDoc,
  skeletonDoc,
];

export function findComponentDoc(slug: string): ComponentDoc | undefined {
  return COMPONENT_DOCS.find((doc) => doc.slug === slug);
}
