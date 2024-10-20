### Environment

```
  System:
    OS: Windows 11 10.0.22631
    CPU: (8) x64 Intel(R) Core(TM) i5-1035G1 CPU @ 1.00GHz
    Memory: 724.99 MB / 7.77 GB
  Binaries:
    Node: 20.15.1 - ~\.nvm\versions\node\v20.15.1\bin\node.EXE
    npm: 10.7.0 - ~\.nvm\versions\node\v20.15.1\bin\npm.CMD
    bun: 1.1.26 - ~\AppData\Roaming\npm\bun.CMD
  Browsers:
    Edge: Chromium (127.0.2651.74)
    Internet Explorer: 11.0.22621.3527
```

### Reproduction URL

https://github.com/pantharshit007/RupeeRush/tree/authjs-error

### Describe the issue

so initially when i was using next-auth v4\* it was working fine in my turbo-repo but when I migrated to `v5-beta.24` when I add the middleware.ts file to the root of my nextjs app directory `user-app` it started creating errors like `module not found` and others.

![image](https://github.com/user-attachments/assets/8f27fefa-4524-4202-8361-ff2b1d6750fa)

```shell

> user-app@0.1.0 dev
> next dev --turbo --port 3000

  ▲ Next.js 14.2.15 (turbo)
  - Local:        http://localhost:3000
  - Environments: .env.local
  - Experiments (use with caution):
    · turbo

 ✓ Starting...
 ⨯ ./node_modules/@mapbox/node-pre-gyp/lib/util/nw-pre-gyp/index.html
Unknown module type
This module doesn't have an associated type. Use a known file extension, or register a loader for it.

Read more: https://nextjs.org/docs/app/api-reference/next-config-js/turbo#webpack-loaders


 ⨯ ./node_modules/fs.realpath
Unknown module type
This module doesn't have an associated type. Use a known file extension, or register a loader for it.

Read more: https://nextjs.org/docs/app/api-reference/next-config-js/turbo#webpack-loaders


 ⨯ ./node_modules/fs.realpath
Unknown module type
This module doesn't have an associated type. Use a known file extension, or register a loader for it.

Read more: https://nextjs.org/docs/app/api-reference/next-config-js/turbo#webpack-loaders


 ⨯ ./node_modules/@mapbox/node-pre-gyp/lib/util/s3_setup.js:76:15
Module not found: Can't resolve 'aws-sdk'
  74 |
  75 |   // if not mocking then setup real s3.
> 76 |   const AWS = require('aws-sdk');
     |               ^^^^^^^^^^^^^^^^^^
  77 |
  78 |   AWS.config.update(config);
  79 |   const s3 = new AWS.S3();



https://nextjs.org/docs/messages/module-not-found


 ⨯ ./node_modules/@mapbox/node-pre-gyp/lib/util/s3_setup.js:76:15
Module not found: Can't resolve 'aws-sdk'
  74 |
  75 |   // if not mocking then setup real s3.
> 76 |   const AWS = require('aws-sdk');
     |               ^^^^^^^^^^^^^^^^^^
  77 |
  78 |   AWS.config.update(config);
  79 |   const s3 = new AWS.S3();



https://nextjs.org/docs/messages/module-not-found


 ⨯ ./apps/user-app/auth.ts:8:1
Module not found: Can't resolve 'crypto'
   6 | import bcrypt from "bcrypt";
   7 | import NextAuth, { NextAuthConfig, NextAuthResult } from "next-auth";
>  8 | import { randomUUID } from "crypto";
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   9 |
  10 | const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  11 | const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;



https://nextjs.org/docs/messages/module-not-found


 ⨯ ./apps/user-app/auth.ts:8:1
Module not found: Can't resolve 'crypto'
   6 | import bcrypt from "bcrypt";
   7 | import NextAuth, { NextAuthConfig, NextAuthResult } from "next-auth";
>  8 | import { randomUUID } from "crypto";
     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
   9 |
  10 | const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
  11 | const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;



https://nextjs.org/docs/messages/module-not-found


 ⨯ ./node_modules/bcrypt/bcrypt.js:8:14
Module not found: Can't resolve 'crypto'
   6 | var bindings = require(binding_path);
   7 |
>  8 | var crypto = require('crypto');
     |              ^^^^^^^^^^^^^^^^^
   9 |
  10 | var promises = require('./promises');
  11 |



https://nextjs.org/docs/messages/module-not-found


 ⨯ ./node_modules/tar/lib/unpack.js:47:16
Module not found: Can't resolve 'crypto'
  45 | const GID = Symbol('gid')
  46 | const CHECKED_CWD = Symbol('checkedCwd')
> 47 | const crypto = require('crypto')
     |                ^^^^^^^^^^^^^^^^^
  48 | const getFlag = require('./get-write-flag.js')
  49 | const platform = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform
  50 | const isWindows = platform === 'win32'



https://nextjs.org/docs/messages/module-not-found


 ⨯ ./node_modules/bcrypt/bcrypt.js:8:14
Module not found: Can't resolve 'crypto'
   6 | var bindings = require(binding_path);
   7 |
>  8 | var crypto = require('crypto');
     |              ^^^^^^^^^^^^^^^^^
   9 |
  10 | var promises = require('./promises');
  11 |



https://nextjs.org/docs/messages/module-not-found


 ⨯ ./node_modules/tar/lib/unpack.js:47:16
Module not found: Can't resolve 'crypto'
  45 | const GID = Symbol('gid')
  46 | const CHECKED_CWD = Symbol('checkedCwd')
> 47 | const crypto = require('crypto')
     |                ^^^^^^^^^^^^^^^^^
  48 | const getFlag = require('./get-write-flag.js')
  49 | const platform = process.env.TESTING_TAR_FAKE_PLATFORM || process.platform
  50 | const isWindows = platform === 'win32'



https://nextjs.org/docs/messages/module-not-found


 ⨯ ./node_modules/@mapbox/node-pre-gyp/lib/util/s3_setup.js:43:21
Module not found: Can't resolve 'mock-aws-s3'
  41 |     // here we're mocking. node_pre_gyp_mock_s3 is the scratch directory
  42 |     // for the mock code.
> 43 |     const AWSMock = require('mock-aws-s3');
     |                     ^^^^^^^^^^^^^^^^^^^^^^
  44 |     const os = require('os');
  45 |
  46 |     AWSMock.config.basePath = `${os.tmpdir()}/mock`;



https://nextjs.org/docs/messages/module-not-found


 ⨯ ./node_modules/@mapbox/node-pre-gyp/lib/util/s3_setup.js:43:21
Module not found: Can't resolve 'mock-aws-s3'
  41 |     // here we're mocking. node_pre_gyp_mock_s3 is the scratch directory
  42 |     // for the mock code.
> 43 |     const AWSMock = require('mock-aws-s3');
     |                     ^^^^^^^^^^^^^^^^^^^^^^
  44 |     const os = require('os');
  45 |
  46 |     AWSMock.config.basePath = `${os.tmpdir()}/mock`;



https://nextjs.org/docs/messages/module-not-found


 ⨯ ./node_modules/@mapbox/node-pre-gyp/lib/util/s3_setup.js:112:16
Module not found: Can't resolve 'nock'
  110 |   }
  111 |
> 112 |   const nock = require('nock');
      |                ^^^^^^^^^^^^^^^
  113 |   // the bucket used for testing, as addressed by https.
  114 |   const host = 'https://mapbox-node-pre-gyp-public-testing-bucket.s3.us-east-1.amazonaws.com';
  115 |   const mockDir = process.env.node_pre_gyp_mock_s3 + '/mapbox-node-pre-gyp-public-testing-bucket';



https://nextjs.org/docs/messages/module-not-found


 ⨯ ./node_modules/@mapbox/node-pre-gyp/lib/util/s3_setup.js:112:16
Module not found: Can't resolve 'nock'
  110 |   }
  111 |
> 112 |   const nock = require('nock');
      |                ^^^^^^^^^^^^^^^
  113 |   // the bucket used for testing, as addressed by https.
  114 |   const host = 'https://mapbox-node-pre-gyp-public-testing-bucket.s3.us-east-1.amazonaws.com';
  115 |   const mockDir = process.env.node_pre_gyp_mock_s3 + '/mapbox-node-pre-gyp-public-testing-bucket';



https://nextjs.org/docs/messages/module-not-found


 ✓ Compiled in 3.1s
 ✓ Ready in 8.5s

```

### How to reproduce

clone the git repo: `https://github.com/pantharshit007/RupeeRush/tree/authjs-error` use branch `authjs-error`

> npm i
> create `.env`
> add these:

```
NEXTAUTH_SECRET=test        # YOU CAN USE THIS CMD(unix): openssl rand -hex 32
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:3333/postgres"
```

> npm run db:docker
> npm run db:generate
> npm run db:web

you will see the error before hitting the end point `/auth/register` or `/`

### Expected behavior

It should work fine there should be no error even with or without the middleware.ts file when using `authjs V5`
