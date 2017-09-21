<template>
  <div class="container">
    <div class="row">
      <div class="col-md-12">
        <h1 class="text-center">October 1st &mdash; <strong>Church Picnic</strong></h1></div>
      <div class="col-md-12">
        <div role="group" class="btn-group btn-group-justified"><a class="btn btn-primary btn-lg" role="button" href="#"><i class="glyphicon glyphicon-bell"></i> Register today</a></div>
        <div class="well well-sm">
          <form>
            <div class="row">
              <div class="col-md-5">
                <p>To start, click the button to Register yourself.</p>
                <p>After that, you can add and register other persons, for example: your family members, or your friends (Adventist or not).</p>
                <p>The Church will cover both Transportation and the Entry fees when we get there, but <strong>only</strong> if the person is a Member of the Church or a Sabbath School class.</p>
              </div>
              <div class="col-md-7">
                <div role="group" class="btn-group" style="margin-bottom: .5em">
                  <button class="btn btn-info" type="button">Register myself</button>
                  <button class="btn btn-danger" type="button">Remove </button>
                </div>
                <div class="well well-sm" style="background-color:rgb(235,235,235);">
                  <div class="form-group">
                    <label class="control-label">Name of the person</label>
                    <input type="text" class="form-control" />
                  </div>
                  <div class="form-group">
                    <label class="control-label">Please check what applies</label>
                    <div class="checkbox">
                      <label class="control-label">
                        <input type="checkbox" />Need <strong>Special Transportation</strong></label>
                    </div>
                    <div class="checkbox">
                      <label class="control-label">
                        <input type="checkbox" />Member of the English-Speaking Church</label>
                    </div>
                    <div class="checkbox">
                      <label class="control-label">
                        <input type="checkbox" />Registered in one of the English-Speaking Church Sabbath school class</label>
                    </div>
                  </div>
                  <div role="group" class="btn-group">
                    <button class="btn btn-primary" type="button">Add to the List</button>
                    <button class="btn btn-default" type="button">Do not add</button>
                  </div>
                </div>
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                    <tr>
                      <th>Name </th>
                      <th>Fees </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                      <td>Cell 1</td>
                      <td>Paid by the Church</td>
                    </tr>
                    <tr>
                      <td>Cell 3</td>
                      <td>Cell 4</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
                <p class="text-danger">The fees must be paid on, or before Wednesday 27th of September 2017. If you miss this date, your registration will be removed.</p>
                <p class="text-danger">The Church is covering Transportation for one or more of the persons you have registered. Those must go with the Special Transportation on sunday, otherwise, you will pay the full Transportation fees of 4000 Ar per person.</p>
              </div>
              <div class="col-md-12">
                <div role="group" class="btn-group">
                  <button class="btn btn-primary" type="button"><i class="glyphicon glyphicon-ok"></i> Finish + Confirm registration</button>
                  <button class="btn btn-default" type="button">Cancel everything</button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <p class="lead text-center bg-danger">You need to pay the fees, totalling xxx Ar. Remember, the deadline is on Wednesday.</p>
      </div>
      <div class="col-md-12">
        <h4>Here are the list of those going ...</h4>
        <p>Don&#39;t wait, those who come first will enter first when we arrive.</p>
        <div class="table-responsive">
          <table class="table">
            <thead>
            <tr>
              <th>Registered by</th>
              <th>Name </th>
              <th>When </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Cell 1</td>
              <td>Cell 2</td>
              <td>Cell 2</td>
            </tr>
            <tr>
              <td>Cell 3</td>
              <td>Cell 2</td>
              <td>Cell 4</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index'
}
</script>

<style>
</style>
