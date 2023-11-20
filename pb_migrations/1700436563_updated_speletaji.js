/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0cocnj9515eu1ie")

  collection.createRule = "secret = game.secret"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0cocnj9515eu1ie")

  collection.createRule = null

  return dao.saveCollection(collection)
})
