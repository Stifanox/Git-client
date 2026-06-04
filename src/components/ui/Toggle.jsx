export default function Toggle({ enabled, onChange }) {
    return (
        <button
            type="button"
            className={`relative inline-flex h-[22px] w-[38px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                enabled ? 'bg-primary' : 'bg-surface-container-highest'
            }`}
            onClick={() => onChange(!enabled)}
        >
      <span
          className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-surface shadow ring-0 transition duration-200 ease-in-out ${
              enabled ? 'translate-x-[16px] bg-surface' : 'translate-x-0 bg-on-surface-variant'
          }`}
      />
        </button>
    );
}