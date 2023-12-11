migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jujjbq0fubmtwqr")

  collection.listRule = "@request.auth.id = creator.id || official = true"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jujjbq0fubmtwqr")

  collection.listRule = null

  return dao.saveCollection(collection)
})
