/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wtglq2y9rjye0wz")

  collection.createRule = "@request.auth.id = creator.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("wtglq2y9rjye0wz")

  collection.createRule = null

  return dao.saveCollection(collection)
})
