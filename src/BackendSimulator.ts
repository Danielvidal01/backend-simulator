export interface GetParams {
  page?: number;
  pageSize?: number;
  query?: any;
  search?: string;
}

export default class BackendSimulator {
  private items: any[];

  constructor(initialItems: any[] = []) {
    this.items = initialItems;
  }

  public getItems({ page = 0, pageSize = 2, query = {}, search }: GetParams) {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        this.items = await this.handleQuery(query);
        this.items = await this.handleSearch(search);
        const totalPages = this.items.length / pageSize;
        const skip = pageSize * page;
        this.items = this.items.filter(
          (item, index) => index + 1 <= skip + pageSize
        );
        console.log(this.items);
        resolve({ items: this.items, totalPages });
      } catch (error) {
        reject(error);
      }
    });
  }

  private async handleQuery(query: any) {
    return new Promise<any[]>((resolve: any, reject: any) => {
      try {
        const queryItems = Object.entries(query);
        let items = Array.from(this.items);
        queryItems.forEach((qry) => {
          items = items.filter((itm) =>
            qry[1] instanceof Array
              ? qry[1].includes(itm[`${qry[0]}`])
              : itm[`${qry[0]}`] === qry[1]
          );
        });
        resolve(items);
      } catch (error) {
        reject(error);
      }
    });
  }

  private async handleSearch(search: string) {
    return new Promise<any[]>((resolve: any, reject: any) => {
      if (!search) {
        resolve(this.items);
      }
      try {
        if (this.items.length === 0) {
          return resolve(this.items);
        }
        let items = new Set();
        this.items.forEach((item) => {
          const entries = Object.entries(item);
          entries.forEach((entrie) => {
            if (
              (entrie[1] instanceof Array || typeof entrie[1] === "string") &&
              entrie[1].includes(search)
            ) {
              items.add(item);
            } else if (
              typeof entrie[1] === "number" &&
              entrie[1] === Number(search)
            ) {
              items.add(item);
            }
          });
        });
        resolve(Array.from(items));
      } catch (error) {
        reject(error);
      }
    });
  }

  public async getItemById(id) {
    return new Promise((resolve: any, reject: any) => {
      try {
        const index = this.items.findIndex((item) => item.id === id);
        resolve(index === -1 ? {} : this.items[index]);
      } catch (error) {
        reject(error);
      }
    });
  }

  public async save(item: any) {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const itm = await this.getItemById(item.id);
        if (Object.keys(itm).length === 0) {
          this.items = this.items.concat(item);
        } else {
          throw new Error("id ja registrado");
        }
        resolve(item);
      } catch (error) {
        reject(error);
      }
    });
  }

  public async put(id: number | string, item: any) {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const index = this.items.findIndex((itm) => itm.id === id);

        if (index !== -1) {
          this.items[index] = { ...this.items[index], ...item };
          resolve({});
        } else {
          throw new Error("id nao encontrado");
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  public async delete(id: number) {
    return new Promise(async (resolve: any, reject: any) => {
      try {
        const index = this.items.findIndex((itm) => itm.id === id);

        if (index !== -1) {
          this.items.splice(index, 1);
          resolve({});
        } else {
          throw new Error("id nao encontrado");
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
