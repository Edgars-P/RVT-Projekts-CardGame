migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0cocnj9515eu1ie")

  collection.listRule = ""
  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("0cocnj9515eu1ie")

  collection.listRule = null
  collection.viewRule = null

  return dao.saveCollection(collection)
})
