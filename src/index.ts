import BackendSimulator from "./BackendSimulator";
async function run() {
  const backend = new BackendSimulator([
    { name: "daniel", id: 1, haha: ["9"] },
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
