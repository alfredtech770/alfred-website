//
//  SuperwallKit_Stub.swift
//  Alfred App
//
//  Local stub for SuperwallKit.
//  Replace with real SPM package: https://github.com/superwall/Superwall-iOS
//
//  NOTE: Remove this file once you add the real SuperwallKit package via
//  File > Add Package Dependencies in Xcode.
//

import Foundation

class Superwall {
    static let shared = Superwall()
    private init() {}

    func register(placement: String) {
        #if DEBUG
        print("⚡ Superwall stub: register placement '\(placement)'")
        #endif
    }

    func register(placement: String, handler: (() -> Void)? = nil) {
        handler?()
        #if DEBUG
        print("⚡ Superwall stub: register placement '\(placement)' with handler")
        #endif
    }
}
