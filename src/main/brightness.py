#!/usr/bin/env python3
"""
Just Slip - Brightness Control Script
Cross-platform brightness control using platform-specific APIs
"""

import sys
import os
import subprocess


def get_macos_brightness():
    """Get current brightness on macOS using CAWindowServerDisplay"""
    try:
        from Quartz import CAWindowServerDisplay
        display = CAWindowServerDisplay.alloc().init()
        # Return a reasonable default since we can't read current value directly
        return 50
    except ImportError:
        print("ERROR: Quartz not available", file=sys.stderr)
        return None
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return None


def set_macos_brightness(value):
    """Set brightness on macOS using CAWindowServerDisplay"""
    try:
        from Quartz import CAWindowServerDisplay
        display = CAWindowServerDisplay.alloc().init()
        normalized = max(0.0, min(1.0, value / 100.0))
        display.setSDRBrightness_(normalized)
        display.commitBrightness_(None)
        return True
    except ImportError:
        print("ERROR: Quartz not available", file=sys.stderr)
        return False
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return False


def get_linux_brightness():
    """Get current brightness on Linux"""
    try:
        backlight_path = '/sys/class/backlight'
        if os.path.exists(backlight_path):
            devices = os.listdir(backlight_path)
            if devices:
                max_path = os.path.join(backlight_path, devices[0], 'max_brightness')
                curr_path = os.path.join(backlight_path, devices[0], 'brightness')
                if os.path.exists(max_path) and os.path.exists(curr_path):
                    with open(max_path) as f:
                        max_b = int(f.read().strip())
                    with open(curr_path) as f:
                        curr_b = int(f.read().strip())
                    return round((curr_b / max_b) * 100)
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
    return 50


def set_linux_brightness(value):
    """Set brightness on Linux"""
    try:
        backlight_path = '/sys/class/backlight'
        if os.path.exists(backlight_path):
            devices = os.listdir(backlight_path)
            if devices:
                max_path = os.path.join(backlight_path, devices[0], 'max_brightness')
                curr_path = os.path.join(backlight_path, devices[0], 'brightness')
                if os.path.exists(max_path) and os.path.exists(curr_path):
                    with open(max_path) as f:
                        max_b = int(f.read().strip())
                    new_b = int((value / 100) * max_b)
                    with open(curr_path, 'w') as f:
                        f.write(str(new_b))
                    return True
        subprocess.run(['xrandr', '--output', 'auto', '--brightness', str(value/100)], 
                      capture_output=True, timeout=5)
        return True
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return False


def get_windows_brightness():
    """Get current brightness on Windows"""
    try:
        script = '''
        $device = Get-WmiObject -Query "SELECT * FROM WmiMonitorBrightness WHERE IsInstance = 1"
        if ($device) { $device.CurrentBrightness } else { 50 }
        '''
        result = subprocess.run(['powershell', '-Command', script], 
                               capture_output=True, text=True, timeout=5)
        output = result.stdout.strip()
        return int(output) if output.isdigit() else 50
    except Exception:
        return 50


def set_windows_brightness(value):
    """Set brightness on Windows"""
    try:
        brightness_int = int(value)
        script = (
            '$brightness = ' + str(brightness_int) + ';\n'
            '$device = Get-WmiObject -Query "SELECT * FROM WmiMonitorBrightness WHERE IsInstance = 1";\n'
            'if ($device) { $device.SetBrightness($brightness) }\n'
            'else { $methods = Get-WmiObject -Query "SELECT * FROM WmiMonitorBrightnessMethods WHERE IsInstance = 1"; $methods.WmiSetBrightness(1, $brightness) }'
        )
        subprocess.run(['powershell', '-ExecutionPolicy', 'Bypass', '-Command', script],
                      capture_output=True, timeout=10)
        return True
    except Exception as e:
        print("ERROR: {}".format(e), file=sys.stderr)
        return False


def main():
    if len(sys.argv) < 2:
        print("Usage: brightness.py <get|set> [value]", file=sys.stderr)
        sys.exit(1)
    
    command = sys.argv[1]
    
    if command == 'get':
        platform = sys.platform
        if platform == 'darwin':
            result = get_macos_brightness()
        elif platform == 'linux':
            result = get_linux_brightness()
        elif platform == 'win32':
            result = get_windows_brightness()
        else:
            result = 50
        print(result if result is not None else 50)
    
    elif command == 'set':
        if len(sys.argv) < 3:
            print("ERROR: Missing brightness value", file=sys.stderr)
            sys.exit(1)
        
        try:
            value = float(sys.argv[2])
            value = max(0, min(100, value))
        except ValueError:
            print("ERROR: Invalid brightness value", file=sys.stderr)
            sys.exit(1)
        
        platform = sys.platform
        if platform == 'darwin':
            result = set_macos_brightness(value)
        elif platform == 'linux':
            result = set_linux_brightness(value)
        elif platform == 'win32':
            result = set_windows_brightness(value)
        else:
            result = False
        
        print("OK" if result else "FAIL")
    
    else:
        print("ERROR: Unknown command '{}'".format(command), file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
