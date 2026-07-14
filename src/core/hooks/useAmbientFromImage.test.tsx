import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAmbientFromImage } from './useAmbientFromImage';

class MockImage {
  static instances: MockImage[] = [];
  crossOrigin = '';
  naturalWidth = 8;
  naturalHeight = 8;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  #src = '';

  set src(value: string) {
    this.#src = value;
    MockImage.instances.push(this);
  }

  get src(): string {
    return this.#src;
  }
}

function uniformImageData(width: number, height: number, rgb: [number, number, number]) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    data[i * 4] = rgb[0];
    data[i * 4 + 1] = rgb[1];
    data[i * 4 + 2] = rgb[2];
    data[i * 4 + 3] = 255;
  }
  return { data, width, height, colorSpace: 'srgb' as const };
}

let getImageData: ReturnType<typeof vi.fn>;

beforeEach(() => {
  MockImage.instances = [];
  vi.stubGlobal('Image', MockImage);
  getImageData = vi.fn(() => uniformImageData(8, 8, [120, 60, 30]));
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    drawImage: vi.fn(),
    getImageData,
  } as unknown as CanvasRenderingContext2D);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('useAmbientFromImage', () => {
  it('samples the image and writes an ambient colour on load', () => {
    const { result } = renderHook(() => useAmbientFromImage('/photo.jpg', { strategy: 'average' }));
    expect(result.current).toBeNull();

    act(() => {
      MockImage.instances[0].onload?.();
    });
    expect(result.current).toBe('rgb(120 60 30 / 0.16)');
  });

  it('stays null when reading pixels throws (CORS-tainted canvas)', () => {
    getImageData.mockImplementation(() => {
      throw new Error('SecurityError');
    });
    const { result } = renderHook(() => useAmbientFromImage('/cross-origin.jpg'));

    act(() => {
      MockImage.instances[0].onload?.();
    });
    expect(result.current).toBeNull();
  });

  it('stays null when the image fails to load', () => {
    const { result } = renderHook(() => useAmbientFromImage('/missing.jpg'));

    act(() => {
      MockImage.instances[0].onerror?.();
    });
    expect(result.current).toBeNull();
  });

  it('returns null and creates no image for a null url', () => {
    const { result } = renderHook(() => useAmbientFromImage(null));
    expect(result.current).toBeNull();
    expect(MockImage.instances).toHaveLength(0);
  });

  it('detaches its handlers on unmount so a late load never updates state', () => {
    const { unmount } = renderHook(() => useAmbientFromImage('/photo.jpg'));
    const image = MockImage.instances[0];
    unmount();

    expect(image.onload).toBeNull();
    expect(image.onerror).toBeNull();
  });
});
