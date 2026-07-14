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
import { radioGroupDoc, segmentedDoc, tabsDoc } from './navigation.demos';
import type { ComponentDoc } from './types';

export const COMPONENT_DOCS: ComponentDoc[] = [
  glassSurfaceDoc,
  buttonDoc,
  checkboxDoc,
  inputDoc,
  textareaDoc,
  selectDoc,
  radioGroupDoc,
  segmentedDoc,
  sliderDoc,
  switchDoc,
  tabsDoc,
  tooltipDoc,
  popoverDoc,
  modalDoc,
  toastDoc,
];

export function findComponentDoc(slug: string): ComponentDoc | undefined {
  return COMPONENT_DOCS.find((doc) => doc.slug === slug);
}
