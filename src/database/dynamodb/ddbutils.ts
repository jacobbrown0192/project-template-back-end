import SimpleCrypto from "simple-crypto-js";

const DYNAMO_DB_SECRET_KEY = "CHANGE ME"

export class DynamoDbUtils {
  static encrypt(plaintext) {
    const simpleCrypto = new SimpleCrypto(DYNAMO_DB_SECRET_KEY);
    return simpleCrypto.encrypt(plaintext);
  }

  static decrypt(ciphertext) {
    const simpleCrypto = new SimpleCrypto(DYNAMO_DB_SECRET_KEY);
    return simpleCrypto.decryptObject(ciphertext);
  }
}