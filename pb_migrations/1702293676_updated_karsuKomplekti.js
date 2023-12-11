migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jujjbq0fubmtwqr")

  collection.updateRule = "@request.auth.id = creator.id"
  collection.deleteRule = "@request.auth.id = creator.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("jujjbq0fubmtwqr")

  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
