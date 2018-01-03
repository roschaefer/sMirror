# Single Color Code Tracking Example
#
# This example shows off single color code tracking using the OpenMV Cam.
#
# A color code is a blob composed of two or more colors. The example below will
# only track colored objects which have both the colors below in them.

import sensor, image, time, pyb

# Color Tracking Thresholds (L Min, L Max, A Min, A Max, B Min, B Max)
# The below thresholds track in general red/green things. You may wish to tune them...
thresholds = [(37, 50, -34, -8, 44, 54), # (37, 50, -34, -8, 44, 54)
              (44, 53, 49, 73, 42, 56)] # (44, 53, 49, 73, 42, 56)
# Codes are or'ed together when "merge=True" for "find_blobs".

sensor.reset()
sensor.set_pixformat(sensor.RGB565)
sensor.set_framesize(sensor.QVGA)

sensor.set_auto_gain(False) # must be turned off for color tracking
sensor.set_auto_whitebal(False) # must be turned off for color tracking
clock = time.clock()

# Only blobs that with more pixels than "pixel_threshold" and more area than "area_threshold" are
# returned by "find_blobs" below. Change "pixels_threshold" and "area_threshold" if you change the
# camera resolution. "merge=True" must be set to merge overlapping color blobs for color codes.
p = pyb.Pin("P0", pyb.Pin.OUT_PP)
i = 0
p.low()
while(True):
    if (i > 20):
        p.low()
    else:
        i = i+1
    clock.tick()
    img = sensor.snapshot()
    for blob in img.find_blobs(thresholds, pixels_threshold=100, area_threshold=100, merge=True):
        if blob.code() == 3: # r/g code == (1 << 1) | (1 << 0)
            img.draw_rectangle(blob.rect())
            img.draw_cross(blob.cx(), blob.cy())
            print("Hallo welt")

            p.high() # or p.value(1) to make the pin high (3.3V)
            i = 0
    print(clock.fps())
