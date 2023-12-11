migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hb4j45w5czyx02n")

  collection.updateRule = "@request.auth.id = karsuKomplekts.creator.id"
  collection.deleteRule = "@request.auth.id = karsuKomplekts.creator.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("hb4j45w5czyx02n")

  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
