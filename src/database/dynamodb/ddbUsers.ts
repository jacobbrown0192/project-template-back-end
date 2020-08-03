import {
  attribute,
  hashKey,
  rangeKey,
  table,
  versionAttribute
} from "@aws/dynamodb-data-mapper-annotations";
import * as DynamoDB from "aws-sdk/clients/dynamodb";
import {
  DataMapper,
  QueryPaginator,
  ScanIterator,
  ScanOptions
} from "@aws/dynamodb-data-mapper";
import {DynamoDbUtils} from "./ddbutils";

@table("Users")
export class User {
  @hashKey()
  id;

  @attribute()
  email;

  @attribute()
  name;

  @versionAttribute()
  version;

  constructor(
    id= "",
    email = "",
    name = ""
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
  }
}

export default User;

export class UserRepository {
  dynamoDb;
  mapper;
  tableNamePrefix;

  constructor(dynamoDb, stage) {
    this.tableNamePrefix = stage + "-";
    this.mapper = new DataMapper({
      client: dynamoDb,
      tableNamePrefix: this.tableNamePrefix
    });
    this.dynamoDb = dynamoDb;
  }

  async listUsers(
    pageSize,
    sort,
    startKey,
  ) {
    let keyCondition = {
    };
    const queryOpts = {
      tableNamePrefix: this.tableNamePrefix,
      pageSize: pageSize,
      scanIndexForward: true
    };

    if (startKey) {
      startKey = decodeURIComponent(startKey);
      let keyObj = DynamoDbUtils.decrypt(startKey);
      queryOpts["startKey"] = {
        id: keyObj["id"]
      };
    }

    let resp = new ListResponse();
    const paginator = new QueryPaginator<User>(
      this.dynamoDb,
        User,
        keyCondition,
        queryOpts
    );

    // return a single page of results
    for await (const page of paginator) {
      for (const item of page) {
          let profile = PublicUserProfile.buildFromUser(item);
          resp.list.push(profile);
      }

      if (paginator.lastEvaluatedKey) {
        let lastKey = paginator.lastEvaluatedKey;
        console.log("Last evaluated key: ");
        console.log(lastKey);

        // encrypt the lastEvaluatedKey so we don't reveal internal table structure to users
        resp.lastKey = DynamoDbUtils.encrypt(lastKey);
      }
      resp.pageSize = pageSize;
      break;
    }
    return resp;
  }

  async getUser(id) {
    let user = new User();
    user.id = id;

    let resp = await this.mapper.get(user);
    if (resp) {
      return resp;
    } else {
      throw new Error("User Not Found");
    }
  }

  async updateUser(toSave) {
    let updated = await this.mapper.update(toSave);
    return updated;
  }

  async createUser(user) {
    return await this.mapper.put(user);
  }

  async deleteUser(user) {
    return await this.mapper.delete(user);
  }

  async scan(opts) {
  return await this.mapper.scan(User, opts);
}
}

export class ListResponse {
  lastKey;
  pageSize;
  list;

  constructor() {
    this.list = [];
  }
}