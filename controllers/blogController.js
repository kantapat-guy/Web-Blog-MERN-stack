
//contact to user
// exports.create=(req,res) => {
//     res.json({
//         data:"Hello fron blog-APIs"
//     })
// }

const { json } = require("express");
const slugify = require("slugify");
const Blogs = require("../models/blogs");
const { v4: uuidv4 } = require('uuid');

//Save data
exports.create=(req,res) => {
    const { title, content, author } = req.body
    let slug = slugify(title)

    //use uuid for thai topic(slug not active in thai)
    if(!slug)slug=uuidv4();

    //for validate data
    switch(true){
        case !title:
            return res.status(400).json({error:"Please input a title"})
            break;
        case !content:
            return res.status(400).json({error:"Please input a your content"})
            break;
    }
    //Save data to database
    Blogs.create({ title, content, author, slug }, (err,blog) => {
        if (err) {
            res.status(400).json({error:"This title already exist."})
        }
        res.json(blog)
    })
}

//Fetch data api to blogs
exports.getAllBlogs = (req,res) => {
    Blogs.find({}).exec((err,blogs) => {
        res.json(blogs)
    })
}

//Fetch data from slug (single page blog)
exports.singleBlog = (req,res) => {
    const slug = req.params
    Blogs.findOne(slug).exec((err,blog)=>{
        res.json(blog)
    })
}


//remove data
exports.remove = (req,res) => {
    const {slug} = req.params
    Blogs.findOneAndDelete({slug}).exec((err,blog) => {
        if(err) {
            console.log(err)
        }
        res.json({
            message : "Your content had been delete."
        })
    })
}


//update data
exports.update = (req,res) => {
    const {slug} = req.params
    const { title, content, author } = req.body
    Blogs.findOneAndUpdate({slug}, {title, content, author}, {new:true}).exec((err,blog)=>{
        if(err) {
            console.log(err)
        }
        res.json(blog)
    })
}
