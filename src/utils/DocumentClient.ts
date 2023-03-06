import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument, TranslateConfig } from '@aws-sdk/lib-dynamodb';

/** Facade for a "AWS SDK v2"-type DynamoDB.DocumentClient. */
export class DocumentClient extends DynamoDBDocument {
  /** **Facade for a "AWS SDK v2"-type DynamoDB.DocumentClient.**
   *
   * `translateConfig` defaults to `{ marshallOptions: { removeUndefinedValues: true } }`,
   * which removes undefined values while marshalling.
   * The rest of the parameters are default.
   * ---
   * *Excerpt from original documentation:*
   *
   * The document client simplifies working with items in Amazon DynamoDB by
   * abstracting away the notion of attribute values. This abstraction annotates native
   * JavaScript types supplied as input parameters, as well as converts annotated
   * response data to native JavaScript types.
   *
   * **Here is an example list which is sent to DynamoDB client in an operation:**
   *
   * ```json
   * { "L": [{ "NULL": true }, { "BOOL": false }, { "N": 1 }, { "S": "two" }] }
   * ```
   *
   * The DynamoDB document client abstracts the attribute values as follows in
   * both input and output:
   *
   * ```json
   * [null, false, 1, "two"]
   * ```
   *
   * @see {@link DynamoDBDocument}
   * @see {@link https://www.npmjs.com/package/@aws-sdk/lib-dynamodb @aws-sdk/lib-dynamodb}
   */
  constructor(
    configuration: DynamoDBClientConfig = { region: 'eu-north-1' },
    translateConfig: TranslateConfig = { marshallOptions: { removeUndefinedValues: true } }
  ) {
    super(new DynamoDBClient(configuration), translateConfig);
  }
}
