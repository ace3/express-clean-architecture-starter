const { generateSignature } = require('../../src/utils/tokenUtils');

describe('Token Utils - generateSignature', () => {
  it('should generate a consistent signature for the same secret and timestamp', () => {
    const secret = 'ca6cabe9b251c20a3c2e789caeb53cc85a16825d3aa08e10a38cbc3197f017bc';
    const expectedSignature = generateSignature(secret);
    const reGeneratedSignature = generateSignature(secret);
    expect(expectedSignature).toBe(reGeneratedSignature);
  });

  it('should generate different signatures for different secrets', () => {
    const secret1 = 'ca6cabe9b251c20a3c2e789caeb53cc85a16825d3aa08e10a38cbc3197f017bc';
    const secret2 = 'ca6cabe9b251c20a3c2e789caeb53cc85a16825d3aa08e10a38cbc3197f017b1';
    const signature1 = generateSignature(secret1);
    const signature2 = generateSignature(secret2);
    expect(signature1).not.toBe(signature2);
  });
});
