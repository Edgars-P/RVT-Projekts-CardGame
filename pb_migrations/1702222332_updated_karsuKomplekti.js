migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jujjbq0fubmtwqr")

  collection.createRule = "@request.auth.id = creator.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jujjbq0fubmtwqr")

  collection.createRule = null

  return dao.saveCollection(collection)
})
