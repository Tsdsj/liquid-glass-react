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

// Ordered so the redesigned site's category groups (derived first-seen from
// doc.category) form contiguously and in a sensible reading order:
// General → Data entry → Selection → Navigation → Display → Feedback.
export const COMPONENT_DOCS: ComponentDoc[] = [
  // General
  glassSurfaceDoc,
  buttonDoc,
  // Data entry
  checkboxDoc,
  inputDoc,
  textareaDoc,
  selectDoc,
  sliderDoc,
  switchDoc,
  // Selection
  radioGroupDoc,
  segmentedDoc,
  // Navigation
  tabsDoc,
  breadcrumbDoc,
  paginationDoc,
  sideNavDoc,
  drawerDoc,
  menuDoc,
  // Display
  cardDoc,
  avatarDoc,
  tagDoc,
  badgeDoc,
  progressDoc,
  spinDoc,
  skeletonDoc,
  // Feedback
  tooltipDoc,
  popoverDoc,
  modalDoc,
  toastDoc,
];

export function findComponentDoc(slug: string): ComponentDoc | undefined {
  return COMPONENT_DOCS.find((doc) => doc.slug === slug);
}
