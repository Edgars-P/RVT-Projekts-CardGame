migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wtglq2y9rjye0wz")

  collection.listRule = "@request.auth.id = raditajs.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wtglq2y9rjye0wz")

  collection.listRule = null

  return dao.saveCollection(collection)
})
