'use strick';

{
  Vue.component('sortForm', {
    template: `
    <div class="sort">
      <input type="button" name="sort" id="status" @click="statusSort" value="進捗順に並べる">
      <input type="button" name="sort" id="approached-due" @click="dueSort" value="期限が近い順に並べる">
    </div>
    `,
    props: {
      todos: Array
    },
    data () {
      return {
        sortTodos: []
      }
    },
    methods: {
      statusSort () {
        console.log('反応');
        this.sortTodos = this.todos.sort((a, b) => a.status - b.status).reverse();
        this.$emit('status-sort', this.sortTodos);
      },
      dueSort () {
        this.sortTodos = this.todos.sort((a,b) => {
          if (a.dueDate > b.dueDate) {
            return 1;
          } else if (a.dueDate < b.dueDate) {
            return -1;
          } else {
            return 0;
          }
        });
        this.$emit('due-sort', this.sortTodos);
      }
    }
  })

  const vm = new Vue({
    el: '#app',
    components: {
      'vuejs-datepicker':vuejsDatepicker
    },
    data: {
      newTodo: '',
      todos: [],
      nextIndex: 0,
      statusList: ['未着手', '進行中', '完了'],
      select: 0,
      changeSelect: 0,
      fixedStatus: true,
      isStatus: false,
      isDue: false,
      editIsDue: false,
      dateObject: {
        year: 0,
        month: 0,
        date: 0
      },
      dueDate: '',
      editDueDate: '',
      btn: false,
      editText: '',
      isModalDisplay: false,
      editedIndex: null,
      DatePickerFormat: 'yyyy-MM-dd',
    },
    computed: {
      fixedDueDate () {
        return moment(this.dueDate).format('YYYY-MM-DD')
      },
      fixedEditDueDate () {
        return moment(this.editDueDate).format('YYYY-MM-DD')
      },
      showDue () {
        return{
          year : this.fixedDueDate.substring(0, 4),
          month: this.fixedDueDate.substring(5, 7),
          date : this.fixedDueDate.substring(8)
        }
      },
      editShowDue () {
        return{
          year : this.fixedEditDueDate.substring(0, 4),
          month: this.fixedEditDueDate.substring(5, 7),
          date : this.fixedEditDueDate.substring(8)
        }
      },
    },
    mounted: function() {
      this.$refs.text_input.focus();
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
        if(this.isDue) {
          return;
        }
        this.setCreateDate();
        const date = this.dateObject;
        this.dueDate = `${date.year}-${date.month}-${date.date}`;
      },

      addTodo: function() {
        if(this.newTodo === '') {
          return;
        }
        const todo = {
          title: this.newTodo,
          id: this.nextIndex++,
          status: this.select,
          isStatus: false,
          isDue: this.isDue,
          dueDate: this.fixedDueDate,
          btn: this.btn,
          showDueDate: this.showDue
        };
        if (!todo.isDue) {
          todo.dueDate =  '';
        }
        this.todos.push(todo);
        this.newTodo = '';
        this.select = 0;
        this.isDue = false;
      },
      //statusを訂正するためにselectを表示
      changeStatus: function(i) {
        this.todos[i].isStatus = true;
        this.changeSelect = this.todos[i].status;
      },
      //statusの編集と、statusの固定
      fixSelect: function(i) {
        this.todos[i].status = this.changeSelect;
        this.todos[i].isStatus = false;
      },
      async editModal(i) {
        await(this.isModalDisplay = true)
        this.$refs.edit_area.focus();
        this.editText = this.todos[i].title; 
        this.editIsDue = this.todos[i].isDue;
        this.editDueDate = this.todos[i].dueDate;
        this.editedIndex = i;
        if(this.editIsDue) {
          return;
        }
        this.setCreateDate();
        const date = this.dateObject;
        this.editDueDate = `${date.year}/${date.month}/${date.date}`;
      },
      changeTodo: function() {
        this.todos[this.editedIndex].title = this.editText;
        this.todos[this.editedIndex].isDue = this.editIsDue;
        this.todos[this.editedIndex].dueDate = this.fixedEditDueDate;
        this.todos[this.editedIndex].showDueDate = this.editShowDue;
        
        
        this.isModalDisplay = false;
      },
      statusSort (todos) {
        this.todos = todos;
      },
      dueSort (todos) {
        this.todos = todos;
      }
    }
  });
}