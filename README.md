

# Welcome to Backend Simulator

<h3>This package was created to help beginners who don't have a backend to train server-side communications. </h3>


---
* you can install using Yarn with:

				yarn add backend-simulator

* or using npm with:

				npm install backend-simulator


* usage:

```typescript
   const users = new BackendSimulator();

  await users.save({ name: "daniel", id: 3321 });
  await users.put(3321, { name: "daniel vidal" });
  await users.getById(3321);
  await users.delete(3321);
  users.getItems({
    pageSize: 3,
    query:{
      name:'daniel'
    }
  });
```


