export interface GetParams {
  page?: number;
  pageSize?: number;
  query?: any;
  search?: string;
}

export class BackendSimulator {
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

  private async getItemById(id) {
    return new Promise((resolve: any, reject: any) => {
      try {
        const index = this.items.findIndex((item) => item.id === id);
        resolve(index === -1 ? {} : this.items[index]);
      } catch (error) {
        reject(error);
      }
    });
  }

  save(item: any) {
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
}

async function run() {
  const backend = new BackendSimulator([
    { name: "daniel", id: 1, haha: ["9"] },
    { name: "samuel", id: 2 },
    { name: "mozart", id: 3 },
    { name: "wendel", id: 4 },
    { name: "lala", id: 5 },
    { name: "lele", id: 6 },
    { name: "lili", id: 7 },
    { name: "lolo", id: 8 },
  ]);

  await backend.save({ name: "daniel", id: 3321 });
  backend.getItems({
    pageSize: 133,
  });
}

run();
