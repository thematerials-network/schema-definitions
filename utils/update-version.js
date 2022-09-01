const { SchemaRepositoryVersion } = require('@s1seven/schema-tools-versioning');
const { execSync } = require('child_process');

const { version: pkgVersion } = require('../package.json');
const { defaultServerUrl } = require('./constants');

const schemaFilePaths = [
  { filePath: 'attachment/attachment.json', properties: [{ path: '$id', value: 'attachment/attachment.json' }] },
  {
    filePath: 'chemical-element/chemical-element.json',
    properties: [{ path: '$id', value: 'chemical-element/chemical-element.json' }],
  },
  {
    filePath: 'commercial-transaction/commercial-transaction.json',
    properties: [{ path: '$id', value: 'commercial-transaction/commercial-transaction.json' }],
  },
  { filePath: 'company/company.json', properties: [{ path: '$id', value: 'company/company.json' }] },
  { filePath: 'languages/languages.json', properties: [{ path: '$id', value: 'languages/languages.json' }] },
  { filePath: 'measurement/measurement.json', properties: [{ path: '$id', value: 'measurement/measurement.json' }] },
  {
    filePath: 'commercial-transaction/commercial-transaction.json',
    properties: [{ path: '$id', value: 'commercial-transaction/commercial-transaction.json' }],
  },
  {
    filePath: 'product-description/product-description.json',
    properties: [{ path: '$id', value: 'product-description/product-description.json' }],
  },
  { filePath: 'validation/validation.json', properties: [{ path: '$id', value: 'validation/validation.json' }] },
];

function stageAndCommitChanges() {
  const schemasPaths = schemaFilePaths.map(({ filePath }) => filePath).join(' ');
  execSync(`git add ${schemasPaths}`);
}

(async function (argv) {
  const version = argv[2] || `v${pkgVersion}`;
  const updater = new SchemaRepositoryVersion(defaultServerUrl, schemaFilePaths, version);
  await updater.updateSchemasVersion();

  stageAndCommitChanges();
})(process.argv);
