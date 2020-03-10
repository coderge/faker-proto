# faker-proto

Generate mock data from protobuf files.

## Prepare Protobuf Files Repository

You should put your protobuf file under a git repository.

`demo.proto` is one of the protobuf files.
``` protobuf
syntax = "proto3";
package coderge.demo;

service ReadmeService {
  rpc CopyText(CopyTextReq) returns (CopyTextResp);
}

message CopyTextReq {}
message CopyTextResp {}
```

## Usage

Put a `.fakerpbrc` file at root dir of the project which would like to use mock data.
``` json
{
  "repository": "/path/to/your/git/repository",
  "branch": "master"
}
```

Create a mock server.
``` ts
import { createServer } from 'faker-proto';

createServer({
  /*
    The param req is a Restify Request entity
    http://restify.com/docs/request-api/#request
  */
  getConfigHandler: req => {
    /*
      according to your api route
      should return packageName, serviceName and method according to the request entity
      eg. API Route Config /:package_name/:service_name/:method_name
          Request Path /coderge.demo/ReadmeService/CopyText
    */
    return {
      packageName: req.params['package_name'], // 'coderge.demo', 
      serviceName: req.params['service_name'], // 'ReadmeService',
      methodName: req.params['method_name'] // 'CopyText'
    };
  },
  /*
    The param data is result of mock.js
    https://github.com/nuysoft/Mock
  */
  responseHandler: (res, data) => {
    /*
      Can customize a response
    */
    // res.json(data);
    // res.send(JSON.stringify(data))
    res.json({ msg: 'ok', ret: 0, data });
  },
  /*
    The param data is result of mock.js
    https://github.com/nuysoft/Mock
  */
  /**
   * Hack mock rules of template
   * @param key protobuf message key
   * @param type protobuf message key type (eg. string/int32/bool...)
   */
  hackMockTpl: (key, type, random) => {
    key = key.toLowerCase();
    const keyTypeHas = (k: string, t: string) =>
      type === t && key.indexOf(k) > -1;
    if (keyTypeHas('icon', 'string')) return '@image';
    else if (keyTypeHas('name', 'string')) return '@name';
    return '';
  },
}).then(server => server.start());
```
