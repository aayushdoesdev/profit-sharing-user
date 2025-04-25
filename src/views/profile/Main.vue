<script setup></script>

<template>
  <main
    class="bg-white p-4 m-4 rounded-md flex flex-col md:flex-row items-start gap-4"
  >
    <div class="p-4 flex flex-col items-center w-full md:w-[20%] space-y-4">
      <div class="text-center">
        <div class="w-[100px] h-[100px] bg-slate-500 rounded-full"></div>
        <p>Esther Howard</p>
        <p>Trader</p>
      </div>

      <div class="flex flex-col items-center nrml-text space-y-2">
        <div class="flex items-center gap-2">
          <i class="pi pi-phone"></i>
          <p>+91 87678 87678</p>
        </div>
        <div class="flex items-center gap-2">
          <i class="pi pi-envelope"></i>
          <p>riyu768@gmail.com</p>
        </div>
        <div class="flex items-center gap-2">
          <i class="pi pi-map-marker"></i>
          <p>Dr. San Jose, South Dakota 83475</p>
        </div>
      </div>
    </div>

    <hr
      class="border border-dashed border-black border-opacity-10 w-full md:hidden"
    />

    <div class="border border-dashed hidden md:block h-[450px]"></div>

    <div class="w-full md:w-[80%] space-y-4">
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h2 class="font-bold">Basic info</h2>
          <button class="btn">Edit</button>
        </div>

        <div class="grid grid-cols-2 nrml-text gap-4 md:gap-8">
          <div class="space-y-1">
            <p>Username</p>
            <input
              type="text"
              class="w-full bg-transparent border border-opacity-20 rounded-md outline-none px-4 py-2"
            />
          </div>
          <div class="space-y-1">
            <p>Email</p>
            <input
              type="text"
              class="w-full bg-transparent border border-opacity-20 rounded-md outline-none px-4 py-2"
            />
          </div>
          <div class="space-y-1">
            <p>Number</p>
            <input
              type="text"
              class="w-full bg-transparent border border-opacity-20 rounded-md outline-none px-4 py-2"
            />
          </div>
          <div class="space-y-1">
            <p>Address</p>
            <input
              type="text"
              class="w-full bg-transparent border border-opacity-20 rounded-md outline-none px-4 py-2"
            />
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="font-bold">Change password</h2>
          <button class="btn">Edit</button>
        </div>

        <div class="grid grid-cols-2 gap-4 md:gap-8 nrml-text">
          <div class="space-y-1">
            <p>Current Password</p>
            <input
              type="text"
              class="w-full bg-transparent border border-opacity-20 rounded-md outline-none px-4 py-2"
            />
          </div>
          <div class="space-y-1">
            <p>New password</p>
            <input
              type="text"
              class="w-full bg-transparent border border-opacity-20 rounded-md outline-none px-4 py-2"
            />
          </div>
          <div class="space-y-1">
            <p>Confirm New Password</p>
            <input
              type="text"
              class="w-full bg-transparent border border-opacity-20 rounded-md outline-none px-4 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
