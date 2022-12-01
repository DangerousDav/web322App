const Sequelize = require('sequelize');

var sequelize = new Sequelize('hcufadhf','hcufadhf','x0fua_muI9mnr4uasFKi2qP1TZa33kP6',{
    host:'jelani.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions:{
        ssl: { rejectUnauthorized: false }
    },
    query:{raw: true}
});

var Post = sequelize.define('Post',{
    body: Sequelize.TEXT,
    title: Sequelize.STRING,
    postDate: Sequelize.DATE,
    featureImage: Sequelize.STRING,
    published: Sequelize.BOOLEAN
});

var Category = sequelize.define('Category',{
    category: Sequelize.STRING
});

Post.belongsTo(Category, {foreignKey: 'category'});

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        sequelize.sync().then(()=>{
            resolve();
         }).catch(()=>{
            reject("Unable to sync with database");
        });
});
}

module.exports.getAllPosts = function(){
    return new Promise((resolve, reject) => {
        Post.findAll().then(function(posts){
            resolve(posts);
        }).catch((err)=>{
            reject("no results returned");
        })
});
}

module.exports.getPostsByCategory = function(category){
    return new Promise((resolve, reject) => {
        Post.findAll({
            where:{
                category : category
            }
        }).then(function(posts){
            resolve(posts);
        }).catch((err)=>{
            reject("no results returned");
        });
});

}

module.exports.getPostsByMinDate = function(minDateStr) {
    return new Promise((resolve, reject) => {
        const { gte } = Sequelize.Op;
        Post.findAll({
        where: {
        postDate: {
            [gte]: new Date(minDateStr)
        }.then(function(posts){
            resolve(posts);
        }).catch((err)=>{
            reject("no results returned");
            })
        }
    })
});
}

module.exports.getPostById = function(id){
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where:{
                id : id
            }
        }).then(function(posts){
            resolve(posts[0]);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
}
module.exports.addPost = function(postData){
    return new Promise((resolve,reject)=>{
        postData.published = (postData.published) ? true : false;
        for(var i in postData){
            if(postData[i] == '') postData[i] = null;
        }
        postData.postDate = new Date();
        Post.create(postData).then((posts)=>{
            resolve(posts);
        }).catch((err)=>{
            reject("unable to create post");
        })
    });
}

module.exports.getPublishedPosts = function(){
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where :{
                published : true
            }
            }).then(function(data){
                resolve(data);
            }).catch((err)=>{
                reject("no results returned");
            })
        })
}

module.exports.getPublishedPostsByCategory = function(category){
    return new Promise((resolve,reject)=>{
        Post.findAll({
            where:{
                category : category,
                published : true
            }
        }).then(function(posts){
            resolve(posts);
        }).catch((err)=>{
            reject("no results returned");
        });
    });
}

module.exports.getCategories = function(){
    return new Promise((resolve,reject)=>{
        Category.findAll().then(function(data){
            resolve(data);
        }).catch((err)=>{
            reject("no results returned");
        })
    });
}

module.exports.addCategory = function(categoryData){
    return new Promise((resolve,reject)=>{
        for(var i in categoryData){
            if(categoryData[i] == '') categoryData[i] = null;
        }
        Category.create(categoryData).then((category)=>{
            resolve(category);
        }).catch((err)=>{
            reject("unable to create category");
        })
    });
}


module.exports.deleteCategoryById = function(id){
    return new Promise((resolve,reject)=>{
        Category.destroy({
            where :{
                id : id
            }
        }).then(function(posts){
            resolve("destroyed")
        }).catch((err)=>{
            reject("Unable to Remove Category / Category not found)")
        })
    });
}
module.exports.deletePostById = function(id){
    return new Promise((resolve,reject)=>{
        Post.destroy({
            where :{
                id : id
            }
        }).then(function(posts){
            resolve("destroyed")
        }).catch((err)=>{
            reject("Unable to Remove Category / Category not found)")
        })
    });
}