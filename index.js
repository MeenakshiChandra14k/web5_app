import { Web5 } from '@web5/api';
import { VerifiableCredential } from '@web5/credentials';

/*
Needs globalThis.crypto polyfill. 
Thisa is *not* the crypto you're thinking of.
It's the original crypto...CRYPTOGRAPHY.
*/
import { webcrypto } from 'node:crypto';

// @ts-ignore
if (!globalThis.crypto) globalThis.crypto = webcrypto;

//creating did for alice---->
const { web5, did: aliceDid } = await Web5.connect();

//creating bearer id for alice---->
const { did: aliceBearerDid } = await web5.agent.identity.get({ didUri: aliceDid });

//console.log(aliceDid);

//console.log(aliceBearerDid);


//creating veriafiable credentials---->

const vc = await VerifiableCredential.create({
    type: 'creatingVerifiableCredentialForAlice',
    issuer: aliceDid,
    subject: aliceDid,
    data: {
      name: 'Alice Smith',
      completionDate: new Date().toISOString(),
      //expertiseLevel: 'Beginner'
    }
  });
  
//console.log(vc);

//signing veriafiable credentials---->

const signedVc = await vc.sign({ did: aliceBearerDid });

//console.log(signedVc);

//creating dwn for alice--->
const { record } = await web5.dwn.records.create({
    data: signedVc,
    message: {
      schema: 'DecentralizedWebNodes',
      dataFormat: 'application/vc+jwt',
      published: true
    }
  });

//console.log('writeResult', record);

//read vc from dwn---->
const readSignedVc = await record.data.text();

//console.log('readResult', readSignedVc);

//convert jwt to json format to read vc
const parsedVc = VerifiableCredential.parseJwt({ vcJwt: readSignedVc });

//console.log(parsedVc);


