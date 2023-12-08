<script setup lang="ts">

</script>

<template>
  <div class="container">
    <div class="h-[200px] bg-pink pt-60px">
      <div class="flex items-center gap-4 px-10%">
        <van-image src="/baby.svg" width="50" />
        <div class="flex flex-col justify-around">
          <div class="text-base text-black">
            宝宝
          </div>
          <div class="text-sm text-#666666">
            2021-01-01
          </div>
        </div>
        <van-icon name="edit" class="ml-auto" />
      </div>
      <div class="mt-8 flex justify-around text-center text-sm">
        <div>
          <div>
            100
          </div>
          <div>
            尿不湿
          </div>
        </div>
        <div>
          <div>
            100
          </div>
          <div>
            嘘嘘
          </div>
        </div>
        <div>
          <div>
            100
          </div>
          <div>
            喂养
          </div>
        </div>
        <div>
          <div>
            100
          </div>
          <div>
            尿不湿
          </div>
        </div>
      </div>
    </div>
    <van-cell-group inset class="m-auto w-90% !mt-4">
      <van-cell title="宝宝信息" is-link size="large" />
      <van-cell title="喂养记录" is-link size="large" />
      <van-cell title="疫苗记录" is-link size="large" />
      <van-cell title="家庭成员" is-link size="large" />
      <van-cell title="单元格" is-link size="large" />
      <van-cell title="意见反馈" is-link size="large" />
      <van-cell title="用户协议" is-link size="large" />
    </van-cell-group>
  </div>
</template>

<style scoped lang="scss">
.container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe WPC", "Segoe UI", "HelveticaNeue-Light", system-ui, "Ubuntu", "Droid Sans", sans-serif;
  background-color: #f5f7f9;
  height: 100%;
}
</style>
