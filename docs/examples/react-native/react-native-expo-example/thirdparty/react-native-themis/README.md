# Themis React Native 

[![npm][npm-badge]][npm]
[![JsThemis][github-ci-badge]][github-ci]
[![License][license-badge]][license]

_React Native_ wrapper for [Themis crypto library](https://github.com/cossacklabs/themis).

Themis is a convenient cryptographic library for data protection. 
It provides secure messaging with forward secrecy and secure data storage. Themis is aimed at modern development practices and has a unified API across 12 platforms, including Node.js, WebAssembly, Python, iOS/macOS, and Java/Android.

By [Cossack Labs](https://www.cossacklabs.com/themis/).

[npm]: https://www.npmjs.com/package/react-native-themis
[github-ci]: https://github.com/cossacklabs/themis/actions?query=workflow%3AJsThemis
[github-ci-badge]: https://github.com/cossacklabs/themis/workflows/JsThemis/badge.svg
[license]: LICENSE
[license-badge]: https://img.shields.io/npm/l/jsthemis.svg

## Getting started

### Installation

```
npm install --save react-native-themis
cd ios
pod install 
```

Import it into your project:

```javascript
import {
  keyPair64,
  symmetricKey64,
  secureCellSealWithSymmetricKeyEncrypt64,
  secureCellSealWithSymmetricKeyDecrypt64,
  secureCellSealWithPassphraseEncrypt64,
  secureCellSealWithPassphraseDecrypt64,
  secureCellTokenProtectEncrypt64,
  secureCellTokenProtectDecrypt64,
  secureCellContextImprintEncrypt64,
  secureCellContextImprintDecrypt64,
  secureMessageSign64,
  secureMessageVerify64,
  secureMessageEncrypt64,
  secureMessageDecrypt64,
  string64,
  comparatorInit64,
  comparatorBegin,
  comparatorProceed64,
  KEYTYPE_EC,
  KEYTYPE_RSA,
  COMPARATOR_NOT_READY,
  COMPARATOR_NOT_MATCH,
  COMPARATOR_MATCH,
  COMPARATOR_ERROR
} from 'react-native-themis'
```
That's it!

### Documentation

Read the following resources to learn more:

  - [How to use Themis with React Native](https://docs.cossacklabs.com/themis/languages/react-native/).
  - [General documentation for Themis library on Cossack Labs Documentation Server](https://docs.cossacklabs.com/themis/).

## Usage

```javascript
import { 
  secureSessionCreate64,
  secureSessionConnect64,
  secureSessionWrap64,
  secureSessionUnwrap64,
  secureSessionIsEstablished64
} from 'react-native-themis';

// Create a new secure session
const session = await secureSessionCreate64(sessionId64, privateKey64);

// Connect to a peer
const request = await secureSessionConnect64(session);

// Send a message
const wrapped = await secureSessionWrap64(session, message);

// Receive a message
const unwrapped = await secureSessionUnwrap64(session, message64);

// Check if session is established
const isEstablished = await secureSessionIsEstablished64(session);
```

## API

### Secure Session

#### secureSessionCreate64(sessionId64: string, privateKey64: string): Promise<string>

Creates a new secure session with the given session ID and private key.

- `sessionId64`: Base64-encoded session identifier
- `privateKey64`: Base64-encoded private key
- Returns: Promise resolving to base64-encoded session object

#### secureSessionConnect64(session64: string): Promise<string>

Initiates a connection request for the given session.

- `session64`: Base64-encoded session object
- Returns: Promise resolving to base64-encoded connection request

#### secureSessionWrap64(session64: string, message: string): Promise<string>

Encrypts a message using the secure session.

- `session64`: Base64-encoded session object
- `message`: Message to encrypt
- Returns: Promise resolving to base64-encoded encrypted message

#### secureSessionUnwrap64(session64: string, message64: string): Promise<string>

Decrypts a message using the secure session.

- `session64`: Base64-encoded session object
- `message64`: Base64-encoded encrypted message
- Returns: Promise resolving to decrypted message

#### secureSessionIsEstablished64(session64: string): Promise<boolean>

Checks if the secure session is established.

- `session64`: Base64-encoded session object
- Returns: Promise resolving to boolean indicating if session is established

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## Licensing

Themis for React Native is distributed under [Apache 2.0 license](https://www.apache.org/licenses/LICENSE-2.0).
