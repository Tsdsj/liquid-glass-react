import { buttonDoc, glassSurfaceDoc } from './general.demos';
import {
  checkboxDoc,
  datePickerDoc,
  formDoc,
  inputDoc,
  inputNumberDoc,
  rateDoc,
  uploadDoc,
  selectDoc,
  sliderDoc,
  switchDoc,
  textareaDoc,
} from './entry.demos';
import {
  alertDoc,
  commandDoc,
  modalDoc,
  popoverDoc,
  toastDoc,
  tooltipDoc,
} from './feedback.demos';
import {
  breadcrumbDoc,
  drawerDoc,
  dropdownDoc,
  menuDoc,
  paginationDoc,
  radioGroupDoc,
  segmentedDoc,
  sideNavDoc,
  stepsDoc,
  tabsDoc,
} from './navigation.demos';
import {
  accordionDoc,
  avatarDoc,
  badgeDoc,
  cardDoc,
  emptyDoc,
  progressDoc,
  skeletonDoc,
  spinDoc,
  tableDoc,
  tagDoc,
  timelineDoc,
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
  inputNumberDoc,
  rateDoc,
  uploadDoc,
  datePickerDoc,
  formDoc,
  // Selection
  radioGroupDoc,
  segmentedDoc,
  // Navigation
  tabsDoc,
  breadcrumbDoc,
  paginationDoc,
  sideNavDoc,
  drawerDoc,
  dropdownDoc,
  menuDoc,
  stepsDoc,
  // Display
  cardDoc,
  avatarDoc,
  tagDoc,
  badgeDoc,
  progressDoc,
  spinDoc,
  skeletonDoc,
  tableDoc,
  emptyDoc,
  accordionDoc,
  timelineDoc,
  // Feedback
  tooltipDoc,
  popoverDoc,
  modalDoc,
  toastDoc,
  alertDoc,
  commandDoc,
];

export function findComponentDoc(slug: string): ComponentDoc | undefined {
  return COMPONENT_DOCS.find((doc) => doc.slug === slug);
}
