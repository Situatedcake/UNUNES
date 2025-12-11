import logo from "/Logotype.svg"
import user from "/user.svg"
import cart from "/cart.svg"

export default function Header() {
    return (
        <>
            <div className=" flex flex-nowrap gap-7">
                <img src={logo} className="mr-5"/>
                <input
                    type="text"
                    placeholder="Поиск в Каталоге.."
                    className="bg-white/22 min-w-240 h-20 rounded-[54px] py-5 pl-14 mt-5 text-2xl"/>
                <div className="flex flex-nowrap gap-4 mt-3">
                    <img src={user} />
                    <img src={cart} />
                </div>
            </div>
        </>
    )
}