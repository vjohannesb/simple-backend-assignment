import { parseBrandTextFile, validateTextFile } from '@/functions/vehicleBrandsFileHandler/vehicleBrandsFileHandler';
import { readFileSync } from 'fs';

describe('parseBrandTextFile', () => {
  it('should return an empty array if no text is provided', () => {
    const brands = parseBrandTextFile();
    expect(brands).toHaveLength(0);
  });

  it('should return an empty array if an empty string is provided', () => {
    const brands = parseBrandTextFile('');
    expect(brands).toHaveLength(0);
  });

  it('should return an empty array if a string with only whitespace is provided', () => {
    const brands = parseBrandTextFile(' ');
    expect(brands).toHaveLength(0);
  });

  it('should return an empty array if a string with only newlines is provided', () => {
    const brands = parseBrandTextFile('\n');
    expect(brands).toHaveLength(0);
  });
});

describe('validateTextFile', () => {
  it('should return false if no text is provided', () => {
    const isValid = validateTextFile(undefined);
    expect(isValid).toBeFalsy();
  });

  it('should return false if non-string is provided', () => {
    const isValid = validateTextFile(1 as any);
    expect(isValid).toBeFalsy();
  });

  it('should return false if an empty string is provided', () => {
    const isValid = validateTextFile('');
    expect(isValid).toBeFalsy();
  });

  it('should return false if it contains non-ascii characters', () => {
    const isValid = validateTextFile('�');
    expect(isValid).toBeFalsy();
  });

  it('should return false if an image is provided', () => {
    const file = readFileSync(`${__dirname}/badFile.jpg`, 'utf-8');
    console.log(file);
    const isValid = validateTextFile(file);
    expect(isValid).toBeFalsy();
  });

  it('should return true if a valid string/text file is provided', () => {
    const file = readFileSync(`${__dirname}/goodFile.txt`, 'utf-8');
    const isValid = validateTextFile(file);
    expect(isValid).toBeTruthy();
  });
});
