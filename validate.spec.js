const { loadExternalFile } = require('@s1seven/schema-tools-utils');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const { readFileSync } = require('fs');
const { resolve } = require('path');

const folders = ['company', 'languages'];

folders.forEach((folder) => {
  const { validCertTestSuitesMap, invalidCertTestSuitesMap } = require(resolve(
    __dirname,
    `${folder}/test/test_suites_map.js`,
  ));

  const createAjvInstance = () => {
    const ajv = new Ajv({
      loadSchema: (uri) => loadExternalFile(resolve(__dirname, `/${uri}`), 'json'),
      strictSchema: true,
      strictNumbers: true,
      strictRequired: true,
      strictTypes: true,
      allErrors: true,
    });
    ajv.addKeyword('meta:license');
    addFormats(ajv);
    return ajv;
  };

  describe('Validate', function () {
    const testSchemaPath = resolve(__dirname, `${folder}/test_schema.json`);
    const schemaPath = resolve(__dirname, `${folder}/${folder}.json`);
    const testSchema = JSON.parse(readFileSync(testSchemaPath, 'utf-8'));
    const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));

    it('the schema should validate', () => {
      const validateSchema = createAjvInstance().addSchema(schema).compile(testSchema);
      expect(() => validateSchema()).not.toThrow();
    });

    validCertTestSuitesMap.forEach(({ certificateName }) => {
      it(`${certificateName} should be a valid certificate`, async () => {
        const certificatePath = resolve(__dirname, `${folder}/test/fixtures/${certificateName}.json`);
        const certificate = JSON.parse(readFileSync(certificatePath, 'utf8'));
        const validator = await createAjvInstance().addSchema(schema).compile(testSchema);
        //
        const isValid = await validator(certificate);
        expect(isValid).toBe(true);
        expect(validator.errors).toBeNull();
      });
    });

    invalidCertTestSuitesMap.forEach(({ certificateName, expectedErrors }) => {
      it(`${certificateName} should be an invalid certificate`, async () => {
        const certificatePath = resolve(__dirname, `${folder}/test/fixtures/${certificateName}.json`);
        const certificate = JSON.parse(readFileSync(certificatePath, 'utf8'));
        const validator = await createAjvInstance().addSchema(schema).compile(testSchema);
        //
        const isValid = await validator(certificate);
        expect(isValid).toBe(false);
        expect(validator.errors).toEqual(expectedErrors);
      });
    });
  });
});