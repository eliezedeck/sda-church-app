<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
        <h1 class="text-center" style="margin-top: 1rem">Choose your church</h1>
        <p>If your church is not listed here, click the button bellow to add it.</p>
      </div>
      <div class="col-12">
        <form>
          <div class="card text-light bg-dark">
            <div class="card-body">
              <h4 class="card-title">Add a church</h4>
              <div class="form-group"><label>Church name</label><input type="text" autofocus autocomplete="off" class="form-control" /></div>
              <div role="group" class="btn-group"><button class="btn btn-primary" type="button">Add </button><button class="btn btn-secondary" type="button">Cancel </button></div>
            </div>
          </div>
        </form>
        <div role="group" class="btn-group"><button class="btn btn-primary" type="button"> <i class="fa fa-plus"></i> Add your Church</button></div>
        <table class="table table-bordered table-hover table-responsive" style="margin-top: 1rem">
          <thead>
          <tr>
            <th>Name</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>Cell 1</td>
          </tr>
          <tr>
            <td>Cell 3</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hello'
}
</script>

<style>
</style>
