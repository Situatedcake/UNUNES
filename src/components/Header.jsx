import React, { useContext } from 'react';
import { AppContext } from '../context';

export const Header = ({ onAuthClick, onCartClick, onAdminClick, onSearch }) => {
  const { user, logout } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleLogout = async () => {
    if(confirm("Выйти из акаунта?"))await logout();
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <header className="bg-linear-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white shadow-lg sticky top-0 z-40">
      <div className="py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap">

          {/* Логотип */}
          <div className="text-3xl font-bold flex items-center gap-3 ">
            <img src="/Logotype.svg" alt="Logo" className="h-20" />
            <span className="hidden sm:inline text-xl"></span>
          </div>
          
          {/* Поиск в центре */}
          <div className="gradient-border w-full sm:w-64 lg:w-80  order-3 lg:order-0 mt-3 lg:mt-0">
                <input
                    type="text"
                    placeholder="Поиск в Каталоге..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full h-12 py-3 pl-4 pr-4 text-white placeholder-white/60 bg-transparent border-none outline-none text-2xl "
                />
          </div>

          {/* Кнопки */}
          <div className="flex items-center gap-5 flex-wrap justify-end">
            {user ? (
              <>
                <span className="text-xl md:text-base font-medium text-center">
                  <img src="/user.svg" className='h-10' /> {user.username}
                </span>
                {user.isAdmin && (
                  <button
                    onClick={onAdminClick}
                    className="bg-orange-600 hover:bg-orange-700 px-6 md:px-6 py-2 md:py-4 rounded-lg transition font-medium text-4xl md:text-sm"
                  >
                    <img src="/settings.svg" className='h-10'/>
                  </button>
                )}
                <button
                  onClick={onCartClick}
                  className="bg-blue-600 hover:bg-blue-700 px-3 md:px-6 py-2 md:py-4 rounded-lg transition font-medium text-xs md:text-sm"
                >
                  <img src="/cart.svg" className='h-10'/>
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-3 md:px-6  py-2 md:py-5 rounded-lg transition font-medium text-xs md:text-sm"
                >
                  <img src="/logOut.svg" className='h-8' />
                </button>
              </>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-green-600 hover:bg-green-700 px-3 md:px-4 py-2 md:py-3 rounded-lg transition font-medium text-xs md:text-sm"
              >
                Войти
              </button>
            )}
          </div>

        </div>
        
      </div>
    </header>
  );
};
