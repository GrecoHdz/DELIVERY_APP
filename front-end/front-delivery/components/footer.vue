    <!-- Footer -->
    <footer class="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3">
        <div class="flex justify-around items-center">
          <div class="flex flex-col items-center">
            <a href="/Dashboard_Cliente" class="flex flex-col items-center">
              <HomeIcon class="text-blue-600" :size="20" />
              <span class="text-xs text-blue-600 mt-1">Inicio</span>
            </a>
          </div>
          <div class="flex flex-col items-center">
            <a href="/Favoritos" class="flex flex-col items-center">
              <HeartIcon class="text-blue-600" :size="20" />
              <span class="text-xs text-blue-600 mt-1">Favoritos</span>
            </a>
          </div>
          <div class="flex flex-col items-center relative">
            <a href="/Carrito" class="flex flex-col items-center"></a>
            <div class="bg-blue-600 rounded-full p-2">
              <ShoppingCartIcon class="text-white" :size="20" />
            </div>
            <span class="text-xs text-blue-600 mt-1">Carrito</span>
          </div>
          <div class="flex flex-col items-center">
            <a href="PedidosCliente" class="flex flex-col items-center">
              <ShoppingBagIcon class="text-blue-600" :size="20" />
              <span class="text-xs text-blue-600 mt-1">Pedidos</span>
            </a>
          </div>
          <div class="flex flex-col items-center">
            <a href="/Perfil" class="flex flex-col items-center">
              <div class="cursor-pointer">
                <SettingsIcon class="text-blue-600" :size="20" />
              </div>
              <span class="text-xs text-blue-600 mt-1">Configuración</span>
            </a>
          </div>
        </div>
      </footer>