import BackendSimulator from "./BackendSimulator";
export interface User {
  name: string;
  id: number | string;
}
async function run() {
  const backend = new BackendSimulator<User>([
    { name: "daniel", id: 1 },
    { name: "samuel", id: 2 },
    { name: "mozart", id: 3 },
    { name: "wendel", id: 4 },
    { name: "maicao", id: 5 },
  ]);

  await backend.save({ name: "daniel", id: 3321 });
  await backend.put(3321, { name: "daniel vidal" });
  await backend.delete(4);
  backend.getItems({
    pageSize: 3,
  });
}

run();
