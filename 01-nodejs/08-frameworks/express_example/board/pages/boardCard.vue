<template>
  <v-card>
    <template v-if="!edit">
      <v-card-title primary-title>
        <h3 class="headline mb-0">{{board.name}}</h3>
      </v-card-title>
      <v-divider light></v-divider>
      <v-card-text>
        <div>제목: {{board.title}}</div>
        <div>가격: {{board.price}}</div>
        <div>설명: {{board.rmk}}</div>
        <div>❤️: {{board.like}}</div>
      </v-card-text>

      <v-divider light></v-divider>
      <v-card-actions>
        <v-btn color="orange" @click="modeChange(board)">수정</v-btn>
        <v-btn color="error" @click="ca=true">삭제</v-btn>
        <v-btn @click="like(board)">👍</v-btn>
        <v-btn @click="unlike(board)">👎 </v-btn>
      </v-card-actions>
    </template>
    <template v-else>
      <v-card-title>
        <span class="headline">게시판 수정</span>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            label="작성자"
            :hint="form.name ? '' : '작성자 이름'"
            persistent-hint
            required
            v-model="form.name"
          ></v-text-field>

          <v-text-field
            label="게시판 제목"
            :hint="form.title ? '' : '작품 이름'"
            persistent-hint
            required
            v-model="form.title"
          ></v-text-field>

          <v-text-field
            label="게시판 설명"
            :hint="form.rmk ? '' : '작품 설명'"
            persistent-hint
            required
            v-model="form.rmk"
          ></v-text-field>

          <v-text-field
            label="가격"
            :hint="form.price ? '' : '가격'"
            persistent-hint
            required
            v-model="form.price"
          ></v-text-field>
        </v-form>

      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" @click="mod(board)">확인</v-btn>
        <v-btn color="error darken-1" @click.native="edit = false">취소</v-btn>
      </v-card-actions>
    </template>

    <v-card-text v-if="ca">
      <v-alert v-model="ca" type="warning">
        <h4>정말 진행 하시겠습니까?</h4>
        <v-btn color="error" @click="del(board)">확인</v-btn>
        <v-btn color="secondary" @click="ca=false">취소</v-btn>
      </v-alert>
    </v-card-text>
    <v-card-text v-if="ma.act">
      <v-alert v-model="ma.act" :type="ma.type" dismissible>{{ma.msg}}</v-alert>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  props: ['board'],
  data () {
    return {
      ca: false,
      ma: {
        act: false,
        msg: '',
        type: 'error'
      },
      form: {
        name: '',
        title: '',
        price: 0,
        like: 0,
        rmk: ''
      },
      edit: false
    }
  },
  methods: {
    modeChange (b) {
      this.edit = true
      this.form = {
        name: b.name,
        title: b.title,
        price: b.price,
        rmk: b.rmk
      }
    },
    like (board) {
      this.$axios.put(`/api/manage/board/like/${board._id}`, this.form)
        .then((r) => {
          this.$emit('list')
        })
        .catch((e) => {
          if (!e.response) {
            this.pop(e.message, 'warning')
          }
        })
    },
    unlike (board) {
      this.$axios.put(`/api/manage/board/unlike/${board._id}`, this.form)
        .then((r) => {
          this.$emit('list')
        })
        .catch((e) => {
          if (!e.response) {
            this.pop(e.message, 'warning')
          }
        })
    },
    mod (board) {
      if (board.name === this.form.name && board.title === this.form.title && board.rmk === this.form.rmk && board.price === this.form.price) {
        return this.pop('변경한 것이 없습니다.', 'warning')
      }
      this.$axios.put(`/api/manage/board/${board._id}`, this.form)
        .then((r) => {
          if (!r.data.success) {
            throw new Error(r.data.msg)
          }
          board.name = this.form.name
          board.title = this.form.title
          board.rmk = this.form.rmk
          board.price = this.form.price
          this.edit = false
        })
        .catch((e) => {
          if (!e.response) {
            this.pop(e.message, 'warning')
          }
        })
    },
    del (board) {
      this.$axios.delete(`/api/manage/board/${board._id}`)
        .then((r) => {
          if (!r.data.success) {
            throw new Error(r.data.msg)
          }
          this.$emit('list')
        })
        .catch((e) => {
          if (!e.response) {
            this.pop(e.message, 'warning')
          }
        })
    },
    pop (m, t) {
      if (this.ma.act) {
        return
      }
      this.ma.act = true
      this.ma.msg = m
      this.ma.type = t
      setTimeout(() => {
        this.ma.act = false
      }, 2000)
    }
  }
}
</script>
