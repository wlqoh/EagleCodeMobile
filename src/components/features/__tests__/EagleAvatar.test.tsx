import { render } from '@testing-library/react-native';

import { EagleAvatar } from '../EagleAvatar';
import { getEagleImage } from '../eagleImages';

const mockUseLevels = jest.fn();

jest.mock('@/hooks/useData', () => ({
  useLevels: () => mockUseLevels(),
}));

jest.mock('@/theme/ThemeContext', () => ({
  useTheme: () => ({ colors: { highest: '#000000' } }),
}));

describe('EagleAvatar', () => {
  beforeEach(() => {
    mockUseLevels.mockReset();
  });

  it('falls back to the local scale while levels are loading', async () => {
    mockUseLevels.mockReturnValue({ data: undefined });
    const { getByLabelText } = await render(<EagleAvatar meters={5_480} size={56} />);
    const image = getByLabelText('Орёл VI — Лидер района');
    expect(image.props.source).toEqual(getEagleImage(6));
  });

  it('falls back to the local scale when levels are empty', async () => {
    mockUseLevels.mockReturnValue({ data: [] });
    const { getByLabelText } = await render(<EagleAvatar meters={5_480} size={56} />);
    expect(getByLabelText('Орёл VI — Лидер района')).toBeTruthy();
  });

  it('uses server levels when available', async () => {
    mockUseLevels.mockReturnValue({
      data: [
        { id: 'IV', order: 4, name: 'Сильное крыло', minMeters: 5_000, maxMeters: 13_999 },
      ],
    });
    const { getByLabelText } = await render(<EagleAvatar meters={5_480} size={56} />);
    const image = getByLabelText('Орёл IV — Сильное крыло');
    expect(image.props.source).toEqual(getEagleImage(4));
  });

  it('applies size to width, height and borderRadius', async () => {
    mockUseLevels.mockReturnValue({ data: undefined });
    const { getByLabelText } = await render(<EagleAvatar meters={5_480} size={40} />);
    const image = getByLabelText('Орёл VI — Лидер района');
    const flatStyle = Object.assign({}, ...[image.props.style].flat());
    expect(flatStyle).toMatchObject({ width: 40, height: 40, borderRadius: 20 });
  });
});
