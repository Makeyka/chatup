class Chatroom {
    constructor(room, username) {
        this.room = room
        this.username = username
        this.chats = db.collection('chats')
        this.unsub
    }

    async addChat(message) {
        const now = new Date()
        const chat = {
            message,
            username: this.username,
            room: this.room,
            created_at: firebase.firestore.Timestamp.fromDate(now)
        }
        return await this.chats.add(chat)
    }

    getChats(callback) {
        this.unsub = this.chats
        .where('room', '==', this.room)
        .orderBy('created_at')
        .onSnapshot(snapshot => {
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    callback(change.doc.data())
                }
            })
        })
    }

    updateName(username) {
        this.username = username
        localStorage.setItem('username', username)
    }

    updateRoom(room) {
        this.room = room
        console.log(`Updated room to ${room}`)
        if (this.unsub) {
            this.unsub()
        }
    }
}
