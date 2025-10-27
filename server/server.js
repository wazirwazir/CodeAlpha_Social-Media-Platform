const express = require('express')
const cors = require('cors')
const bcrypt = require('bcrypt-node')
const knex = require('knex')



const app = express()
app.use(cors())
app.use(express.json())

const pg = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        port: 5432,
        user: 'postgres',
        password: 'okikiola357',
        database: 'muse_db'
    }
})



app.get('/profile/:id', (req, res) => {
    const { id } = req.params
    pg.select('*').from('users').where({ id })
    .then(user => {
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('Not found')
        }}
    )
    .catch(error => res.status(400).json('Error performing operation'))
    }
)

app.get('/getcomments/:id', (req, res) => {
    const { id } = req.params
    pg('comments')
    .select('users.avatar',
        'users.name',
        'comments.content',
        'comments.created_at'
    )
    .join('users', 'comments.user_id', '=', 'users.id')
    .where('comments.post_id', id)
    .orderBy('comments.created_at', 'desc')
    .then(user => {
        if (user.length) {
            res.json(user)
        } else {
            res.json('No comments found')
        }}
    )
    .catch(error => res.status(400).json('Error performing operation'))
})


app.post('/posts', (req, res) => {
    const { userIdd } = req.body
    pg('posts')
    .join('users', 'posts.user_id', '=' , 'users.id')
    .leftJoin('comments', 'posts.id', '=', 'comments.post_id' )
    .select( 
        'posts.id as post_id',
        'users.avatar as image',
        'posts.user_id',
        'users.name', 
        'posts.content',
        'posts.likes_count',
        'posts.created_at',
        pg.raw(`
        EXISTS (SELECT 1 FROM post_likes WHERE 
        post_likes.post_id = posts.id and post_likes.user_id = ${userIdd}) as liked,
        EXISTS (SELECT 1 FROM followss WHERE followss.follower_id = ${userIdd} AND followss.following_id = posts.user_id) as followed
            `)
        )
        .count('comments.id as comment_count')
        .from('posts')
        .groupBy('posts.id', 'users.name', 'posts.user_id', 'users.avatar', 'posts.content', 'posts.likes_count')
        .orderBy('posts.created_at', 'desc')
        .then(data => {
            res.json(data)
        })

})


app.post('/signin', (req, res) => {
    const { email, password } = req.body
        pg.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash)
            if (isValid) {
                pg.select('*').from('users')
                .where('email', '=', email)
                .then(user => {
                    res.json(user[0]) 
                })
                .catch(err => res.status(400).json('user cannot be found'))
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => {
            res.status(400).json('incorrect password or username')
        })
})



app.post('/register', (req, res) => {
    const { email, name, password} = req.body
    const hash = bcrypt.hashSync(password);
    pg.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({ 
                email: loginEmail[0].email,
                name: name,
                joined: new Date(),
                avatar: `https://robohash.org/${encodeURIComponent(name)}?set=set2`
            })
            .then(user => res.json(user[0]))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })    
    .catch(err => res.status(400).json('Unable to register'))
})


app.post('/newpost', (req, res) => {
    const { user_id, content } =  req.body
    pg('posts')
    .insert({ 
        user_id: user_id,
        content: content
    })
    .returning('id')
    .then(([inserted]) => {
        const id = inserted.id
        return pg('posts')
        .join('users', 'posts.user_id', '=', 'users.id')
        .leftJoin('comments', 'posts.id', '=', 'comments.post_id' )
        .select(
            'posts.id as post_id',
            'posts.user_id',
            'posts.content',
            'posts.likes_count',
            'posts.created_at',
            'users.name',
            'users.avatar as image'
        )
        .count('comments.id as comment_count')
        .where('posts.id', id)
        .groupBy('posts.id', 'users.name', 'posts.user_id', 'users.avatar', 'posts.content', 'posts.likes_count')
        .first()
    })
    .then(post => res.json(post))
    .catch(err => res.json(err))

})

app.post('/comment', (req, res) => {
    const { post_id, user_id, content } =  req.body
    pg('comments')
    .insert({ 
        post_id: post_id,
        user_id: user_id,
        content: content
    })
    .returning('id')
    .then(([inserted]) => {
        const id = inserted.id
        return pg('comments')
        .join('users', 'comments.user_id', '=', 'users.id')
        .select(
            'comments.id',
            'comments.post_id',
            'comments.content',
            'comments.created_at',
            'users.name',
            'users.avatar'
        )  
        .where('comments.id', id)
        .first()
    })
    .then(comment => res.json(comment))
    .catch(err => res.status(400).json(err))
})


app.post('/like', (req, res) => {
    const { user_id, post_id } =  req.body
    pg('post_likes')
    .where({user_id, post_id})
    .first()
    .then(existing => {
        if(existing) {
            return pg('post_likes')
            .where({user_id, post_id})
            .del()
            .then(() => {
                return pg('posts')
                .where('id', post_id)
                .decrement('likes_count', 1)
                .returning('*')
            })
            .then(post => res.json({message: 'unliked', post: post[0]}))
        } else {
            return pg('post_likes')
                .insert({user_id, post_id})
                .then(() => {
                    return pg('posts')
                    .where('id', post_id)
                    .increment('likes_count', 1)
                    .returning('*')
                })
            .then(post => res.json({message: 'liked', post: post[0]}))
            
        }
    })
    .catch(err=> res.status(400).json(err, 'unable to like'))
    
})



app.post('/follow', (req, res) => {
    const { follower_id, following_id } =  req.body
    
    if (follower_id == following_id) {
        return res.json('unable to follow self')
    }
    pg('followss')
    .where({follower_id, following_id})
    .first()
    .then(existing => {
        if (existing) {
            return pg('followss')
            .where({follower_id, following_id})
            .del()
            .then(()=> {
                res.json('successfully unfollowed')
            })
        } else {
            return pg('followss')
            .insert({follower_id, following_id})
            .then(() => {
                res.json('followed successfully')
            })
        }
    })
    .catch(err => res.status(400).json('unable to toggle follow'))
})


app.get('/followStats/:id', (req, res) => {
    const {id} = req.params

    Promise.all([
        pg('followss').where('follower_id', id)
        .count('following_id as following_count'),
        pg('followss').where('following_id', id)
        .count('follower_id as follower_count')
    ])
    .then(([followers, following]) => {
        res.json({
            following: parseInt(followers[0].following_count),
            followers: parseInt(following[0].follower_count)
        })
    }) 

    .catch(err => res.status(400).json('error fetching stats'))
})





app.get('/userposts/:id', (req, res) => {
    const {id} = req.params
    pg('posts')
    .join('users', 'posts.user_id', '=' , 'users.id')
    .leftJoin('comments', 'posts.id', '=', 'comments.post_id' )
    .select( 
        'posts.id as post_id',
        'users.avatar as image',
        'posts.user_id',
        'users.name', 
        'posts.content',
        'posts.likes_count',
        'posts.created_at',
        pg.raw(`
        EXISTS (SELECT 1 FROM post_likes WHERE 
        post_likes.post_id = posts.id and post_likes.user_id = ${id}) as liked,
        EXISTS (SELECT 1 FROM followss WHERE followss.follower_id = ${id} AND followss.following_id = posts.user_id) as followed`)
        )
        .count('comments.id as comment_count')
        .from('posts')
        .groupBy('posts.id', 'users.name', 'posts.user_id', 'users.avatar', 'posts.content', 'posts.likes_count')
        .orderBy('posts.created_at', 'desc')
        .where('posts.user_id', id)
        .then(data => {
            res.json(data)
        })
        .catch(err => res.status(400).json(err, 'unable to get user posts'))
})

app.delete('/delete', (req, res) => {
        const { post_id } = req.body
        console.log(post_id)
        pg('posts')
        .where('id', post_id)
        .del()
        .then(res => res.json({message: 'post successfully deleted'}))
        .catch(err => res.status(400).json('problem encountered in deleting'))
})


app.get('/following/:id', (req, res) => {
    const { id } = req.params
    pg('followss')
    .join('users', 'followss.following_id', 'users.id')
    .select('users.name',
        'users.id',
        'users.avatar'
        ,pg.raw(`EXISTS (SELECT 1 FROM followss WHERE followss.follower_id = ${id}) as followed`)
    )
    .where('follower_id', id)
    .then(fol => res.json(fol))
    .catch(err => res.status(400).json(err))
})

app.get('/followers/:id', (req, res) => {
    const { id } = req.params
    pg('followss')
    .join('users', 'followss.follower_id', 'users.id')
    .select('users.name',
        'users.id',
        'users.avatar'
        ,pg.raw(`EXISTS (SELECT 1 FROM followss WHERE followss.following_id = ${id}) as following`)
    )
    .where('following_id', id)
    .then(fol => res.json(fol))
    .catch(err => res.status(400).json(err))
})


app.get('/notfollowing/:id', (req, res) => {
    const { id } = req.params
    console.log(id)
    pg('users')
    .select('avatar', 'id', 'name')
    .whereNotIn('id', function () {
        this.select('following_id')
        .from('followss')
        .where('follower_id', id)
    })
    .andWhere('id', '!=', id)
    .select(pg.raw('false as following'))
    .then(result => res.json(result))
    .catch(err => res.status(400).json('not getting anything'))

})




app.listen(3000, console.log('running on port 3000'))