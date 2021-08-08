'use strick';

{

  const vm = new Vue({
    el: '#app',
    data: {
      newTodo: '',
      todos: [],
      statusList: ['未着手', '進行中', '完了'],
      select: 0,
      changeSelect: 'unselected',
      fixedStatus: true,
      isStatus: false,
      isDue: false,
      dateObject: {
        year: 0,
        month: 0,
        date: 0
      },
      dueDate: '',
      btn: false,
    },
    computed: {

    },
    methods: {
      //todoを作った日付を取得
      setCreateDate: function() {
        const date = new Date();
        this.dateObject.year = date.getFullYear();
        this.dateObject.month = date.getMonth() + 1;
        this.dateObject.date = date.getDate();
      },
      //期限を付けるボタンを押すと、期限指定のinputに初期値が設定される処理
      setDate: function() {
        if(this.isDue === true) {
          return;
        }
        console.log('win!')
        this.setCreateDate();
        const date = this.dateObject;
        this.dueDate = `${date.year}/${date.month}/${date.date}`;
      },

      addTodo: function() {
        if(this.newTodo === '') {
          return;
        }
        const todo = {
          title: this.newTodo,
          status: this.select,
          fixedStatus: true,
          isStatus: false,
          isDue: this.isDue,
          dueDate: this.dueDate,
          btn: this.btn
        };
        this.todos.push(todo);
        this.newTodo = '';
        this.select = 0;
        this.isDue = false;
      },
      //statusを訂正するためにselectを表示
      changeStatus: function(i) {
        this.todos[i].fixedStatus = !this.todos[i].fixedStatus;
        this.todos[i].isStatus = !this.todos[i].isStatus;
        this.changeSelect = 'unselected';
      },
      //statusの訂正と、statusの固定
      fixSelect: function(i) {
        this.todos[i].status = this.changeSelect;
        this.changeStatus(i);
      },
    }
  });
}