var categories = require('./category.model')

exports.addCategory = async function (req, res, next){
    let title = req.body.title;

    if (!title) {
        res.status(400).json("Invalid Data");
    } else {
        let category = {
            title: title,
        }
        await categories.addCategory(category);
        res.status(200).json("Category added successfully")
    }
}

exports.getAllCategories = async function(req, res, next){
    let fetchedcategories = await categories.getAllCategories()
    res.status(200).json({categories: fetchedcategories})
}

exports.updateCategory = async function(req, res, next){
    let id = req.body.id;
    let category = req.body.category;
    let categoryRetrieved = await categories.findCategory(id);
    if (categoryRetrieved) {
        await categories.updateCategory(id, category);
        res.status(200).json("Category updated successfully")
    }
    res.status(400).json("Category does not exists")
}

exports.deleteCategory = async function(req, res, next){
    let id = req.body.id;
    let count = await categories.deleteCategory(id)
    if (count === 1) {
        res.status(200).json("Category deleted successfully")
    } else {
        res.status(400).json("Category does not exists")
    }
}

exports.findCategory = async function (req, res, next){
    let searchText = req.body.searchText;
    let result = await categories.findCategory(searchText);
    if (result) {
        res.status(200).json({recordsFound: result})
    } else {
        res.status(200).json({recordsFound: [], message: "No matches found"})
    }
}