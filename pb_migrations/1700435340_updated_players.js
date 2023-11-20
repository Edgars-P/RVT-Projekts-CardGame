/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0cocnj9515eu1ie")

  collection.name = "speletaji"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0cocnj9515eu1ie")

  collection.name = "players"

  return dao.saveCollection(collection)
})
