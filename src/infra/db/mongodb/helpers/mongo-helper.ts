import { MongoClient, Collection } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,
  uri: null as string,
  async connect(uri: string): Promise<void> {
    this.uri = uri;
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  },
  async disconnect(): Promise<void> {
    this.client.close();
    this.client = null;
  },

  async getCollection(name: string): Promise<Collection> {
    if (!this.client?.isConnected()) {
      await this.connect(this.uri);
    }
    return this.client.db().collection(name);
  },

  map(collection: any): any {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { _id, ...collectionWithoutId } = collection;
    return { ...collectionWithoutId, id: _id };
  },

  mapList(collection: any[]): any[] {
    return collection.map((c) => MongoHelper.map((c)));
  },
};
