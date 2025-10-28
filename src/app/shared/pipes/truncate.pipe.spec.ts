import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return empty string for null/undefined input', () => {
    expect(pipe.transform(null as any)).toBe('');
    expect(pipe.transform(undefined as any)).toBe('');
    expect(pipe.transform('')).toBe('');
  });

  it('should return original string if shorter than limit', () => {
    const input = 'Short text';
    expect(pipe.transform(input, 20)).toBe(input);
  });

  it('should truncate string with default limit (50) and trail (...)', () => {
    const input = 'Este é um texto muito longo que deveria ser truncado porque excede o limite padrão de cinquenta caracteres';
    const result = pipe.transform(input);
    
    expect(result.length).toBe(53); // 50 + 3 (...)
    expect(result.endsWith('...')).toBeTrue();
    expect(result.startsWith('Este é um texto muito longo que deveria ser trunca')).toBeTrue();
  });

  it('should truncate with custom limit', () => {
    const input = 'Este é um texto longo';
    const result = pipe.transform(input, 10);
    
    expect(result).toBe('Este é um ...');
  });

  it('should use custom trail', () => {
    const input = 'Este é um texto longo';
    const result = pipe.transform(input, 10, ' [...]');
    
    expect(result).toBe('Este é um  [...]');
  });

  it('should handle edge cases', () => {
    expect(pipe.transform('a', 1)).toBe('a');
    expect(pipe.transform('ab', 1)).toBe('a...');
    expect(pipe.transform('test', 0, '...')).toBe('...');
  });
});